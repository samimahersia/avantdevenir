import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface TabChangeHandlerProps {
  onTabChange: (tab: string) => void;
  setSelectedAvailability: (availability: any) => void;
}

export const TabChangeHandler = ({ onTabChange, setSelectedAvailability }: TabChangeHandlerProps) => {
  const location = useLocation();

  useEffect(() => {
    const handleTabSwitch = (event: CustomEvent) => {
      onTabChange(event.detail.tab);
      if (event.detail.availability) {
        setSelectedAvailability(event.detail.availability);
      }
    };

    window.addEventListener('switchTab', handleTabSwitch as EventListener);
    return () => {
      window.removeEventListener('switchTab', handleTabSwitch as EventListener);
    };
  }, [onTabChange, setSelectedAvailability]);

  useEffect(() => {
    if (location.state?.activeTab) {
      onTabChange(location.state.activeTab);
      if (location.state.availabilityToEdit) {
        setSelectedAvailability(location.state.availabilityToEdit);
      }
    }
  }, [location.state, onTabChange, setSelectedAvailability]);

  return null;
};