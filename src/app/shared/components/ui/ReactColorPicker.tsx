import React from 'react';
import { ChromePicker, ColorResult } from 'react-color';

interface ReactColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ReactColorPicker: React.FC<ReactColorPickerProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const handleColorChange = (color: ColorResult) => {
    onChange(color.hex);
  };

  return (
    <div className={`w-full ${className}`}>
      <ChromePicker
        color={value}
        onChange={handleColorChange}
        disableAlpha={true}
        styles={{
          default: {
            picker: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              width: '100%'
            }
          }
        }}
      />
    </div>
  );
};

export default ReactColorPicker;
