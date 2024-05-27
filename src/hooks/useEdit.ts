import { useState } from "react";

const useEdit = (updateValue: (newValue: string) => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClickCustomer = () => {
    updateValue(newValue);
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  return {
    isEditing,
    newValue,
    setNewValue,
    handleEditClick,
    handleSaveClick,
    handleSaveClickCustomer,
  };
};

export default useEdit;
