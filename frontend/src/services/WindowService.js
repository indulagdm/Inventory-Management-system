// src/services/windowService.js
class WindowService {
  openItemAddWindow() {
    if (window.electronAPI) {
      return window.electronAPI.openItemAddWindow();
    }
    window.open('/add-item', '_blank');
  }

  openCategoryAddWindow() {
    if (window.electronAPI) {
      return window.electronAPI.openCategoryAddWindow();
    }
    window.open('/category-add', '_blank');
  }

  openItemUpdateDeleteWindow() {
    if (window.electronAPI) {
      return window.electronAPI.openItemUpdateDeleteWindow();
    }
    window.open('/item-update-delete', '_blank');
  }

  closeWindow(windowType) {
    if (window.electronAPI) {
      return window.electronAPI.closeChildWindow(windowType);
    }
    window.close();
  }
}

export default new WindowService();