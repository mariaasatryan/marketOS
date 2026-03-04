import { ReactNode, useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  AlertTriangle,
  Settings,
  GripVertical,
  Bell,
  type LucideIcon
} from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { Logo } from './Logo';
import { notificationService } from '../services/notificationService';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  isEditMode: boolean;
  onShowNotifications?: (show: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const defaultMenuItems = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'inbox', icon: Inbox },
  { id: 'reviews', icon: MessageSquare },
  { id: 'alerts', icon: AlertTriangle },
  { id: 'settings', icon: Settings },
];

export function LayoutDraggable({ children, currentPage, onNavigate, isEditMode, onShowNotifications }: LayoutProps) {
  const { t } = useI18n();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const loadNavigationOrder = useCallback(() => {
    const items = defaultMenuItems.map(item => ({
      ...item,
      label: t(`nav.${item.id}`) || item.id
    }));
    setMenuItems(items);
  }, [t]);

  useEffect(() => {
    loadNavigationOrder();
  }, [loadNavigationOrder]);

  // Subscribe to notification changes
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notifications) => {
      const unreadCount = notifications.filter(n => !n.read).length;
      setUnreadNotifications(unreadCount);
    });

    // Load initial notification count
    const notifications = notificationService.getNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    setUnreadNotifications(unreadCount);

    return unsubscribe;
  }, []);

  const saveNavigationOrder = (order: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('navigationOrder', JSON.stringify(order));
    }
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);

    if (!result.destination) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMenuItems(items);
    saveNavigationOrder(items.map(item => item.id));
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <Logo className="flex-1" />
            <div className="flex items-center justify-center">
              <button
                onClick={() => onShowNotifications?.(true)}
                className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <Droppable droppableId="navigation" isDropDisabled={!isEditMode}>
            {(provided, snapshot) => (
              <nav
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex-1 p-4 space-y-1 overflow-y-auto ${
                  snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={!isEditMode}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative ${snapshot.isDragging ? 'z-50' : ''}`}
                        >
                          <button
                            onClick={() => !isDragging && !isEditMode && onNavigate(item.id)}
                            className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                            } ${
                              snapshot.isDragging
                                ? 'shadow-lg ring-2 ring-blue-500 dark:ring-blue-400'
                                : ''
                            } ${isEditMode ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            {isEditMode && (
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                              >
                                <GripVertical size={16} className="text-slate-400" />
                              </div>
                            )}
                            <Icon size={20} className="flex-shrink-0" />
                            <span className="text-left">{item.label}</span>
                          </button>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </nav>
            )}
          </Droppable>
        </DragDropContext>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
