import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Check } from 'lucide-react';

export function MobileSelect({ value, onValueChange, placeholder, children, className }) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract items from children
  const items = React.Children.toArray(children).filter(
    child => child.type === SelectItem || child.type?.displayName === 'SelectItem'
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md ${className || ''}`}>
            <span className="truncate">
              {value ? items.find(item => item.props.value === value)?.props.children || placeholder : placeholder}
            </span>
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{placeholder}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {items.map((item) => (
              <button
                key={item.props.value}
                onClick={() => {
                  onValueChange(item.props.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                  value === item.props.value
                    ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-medium'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.props.children}</span>
                {value === item.props.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}