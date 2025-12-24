import { 
  getAllInventoryItems, 
  getFIFOBatch, 
  saveStockBatch, 
  saveStockMovement, 
  updateItemStock,
  InventoryItem 
} from '../inventoryData';
import { PrasadMenu, PrasadMenuItem } from '../../kitchen-prasad/prasadData';

/**
 * Check if sufficient stock is available for a menu item
 */
export function checkStockAvailability(menuItem: PrasadMenuItem): {
  available: boolean;
  item?: InventoryItem;
  availableQuantity: number;
  message: string;
} {
  const items = getAllInventoryItems();
  
  // Try to find matching inventory item by name (case-insensitive)
  const inventoryItem = items.find(item => 
    item.name.toLowerCase() === menuItem.name.toLowerCase() ||
    item.name.toLowerCase().includes(menuItem.name.toLowerCase()) ||
    menuItem.name.toLowerCase().includes(item.name.toLowerCase())
  );

  if (!inventoryItem) {
    return {
      available: false,
      availableQuantity: 0,
      message: `No inventory item found matching "${menuItem.name}"`,
    };
  }

  const availableQuantity = inventoryItem.currentStock;
  const requiredQuantity = menuItem.quantity;

  return {
    available: availableQuantity >= requiredQuantity,
    item: inventoryItem,
    availableQuantity,
    message: availableQuantity >= requiredQuantity
      ? `Available: ${availableQuantity} ${inventoryItem.unit}`
      : `Low stock: ${availableQuantity} ${inventoryItem.unit} available, ${requiredQuantity} ${inventoryItem.unit} required`,
  };
}

/**
 * Auto-deduct stock when menu is marked as prepared
 */
export function autoDeductStockForMenu(menu: PrasadMenu): {
  success: boolean;
  deducted: Array<{ item: string; quantity: number; unit: string }>;
  errors: Array<{ item: string; message: string }>;
} {
  const items = getAllInventoryItems();
  const deducted: Array<{ item: string; quantity: number; unit: string }> = [];
  const errors: Array<{ item: string; message: string }> = [];

  menu.items.forEach((menuItem) => {
    // Find matching inventory item
    const inventoryItem = items.find(item => 
      item.name.toLowerCase() === menuItem.name.toLowerCase() ||
      item.name.toLowerCase().includes(menuItem.name.toLowerCase()) ||
      menuItem.name.toLowerCase().includes(item.name.toLowerCase())
    );

    if (!inventoryItem) {
      errors.push({
        item: menuItem.name,
        message: `No inventory item found matching "${menuItem.name}"`,
      });
      return;
    }

    // Check availability
    if (inventoryItem.currentStock < menuItem.quantity) {
      errors.push({
        item: menuItem.name,
        message: `Insufficient stock: ${inventoryItem.currentStock} ${inventoryItem.unit} available, ${menuItem.quantity} ${inventoryItem.unit} required`,
      });
      return;
    }

    // Deduct stock using FIFO
    let remainingToDeduct = menuItem.quantity;
    
    while (remainingToDeduct > 0) {
      const batch = getFIFOBatch(inventoryItem.id, remainingToDeduct);
      if (!batch) {
        errors.push({
          item: menuItem.name,
          message: `No available batch found for "${menuItem.name}"`,
        });
        break;
      }

      const deductQuantity = Math.min(remainingToDeduct, batch.remainingQuantity);
      
      // Update batch
      const updatedBatch = {
        ...batch,
        remainingQuantity: batch.remainingQuantity - deductQuantity,
        status: (batch.remainingQuantity - deductQuantity === 0 ? 'consumed' : 'active') as 'active' | 'consumed',
      };
      saveStockBatch(updatedBatch);

      // Record movement
      saveStockMovement({
        id: `movement-${Date.now()}-${Math.random()}`,
        itemId: inventoryItem.id,
        batchId: batch.id,
        type: 'issue',
        quantity: deductQuantity,
        date: new Date().toISOString(),
        reason: `Auto-deducted for menu: ${menu.name}`,
        issuedTo: menu.id,
        createdBy: 'System',
      });

      remainingToDeduct -= deductQuantity;
    }

    // Update item stock
    updateItemStock(inventoryItem.id);

    deducted.push({
      item: menuItem.name,
      quantity: menuItem.quantity,
      unit: inventoryItem.unit,
    });
  });

  return {
    success: errors.length === 0,
    deducted,
    errors,
  };
}

/**
 * Get stock availability for all items in a menu
 */
export function getMenuStockAvailability(menu: PrasadMenu): Array<{
  menuItem: PrasadMenuItem;
  availability: ReturnType<typeof checkStockAvailability>;
}> {
  return menu.items.map(menuItem => ({
    menuItem,
    availability: checkStockAvailability(menuItem),
  }));
}

