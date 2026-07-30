import React, { useRef, useState } from 'react';
import { Input, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface ImageFilePickerProps {
  // ✅ 外部传入base64（受控值）
  value?: string;
  // ✅ 修改时触发，通知父组件setState
  onChange?: (base64: string) => void;
  disabled?: boolean;
}

function ImageFilePicker(props: ImageFilePickerProps) {
  const { value, onChange, disabled = false } = props;
  // 只展示文件名，不再维护base64状态！base64全权由外部控制
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const isImageFile = (file: File) => IMAGE_MIME_TYPES.includes(file.type);

  const handleSetFile = async (file: File) => {
    if (!isImageFile(file)) {
      message.error('仅支持图片文件（jpg/png/gif/webp/svg）');
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setFileName(file.name);
      // 向外抛出，父组件更新state
      onChange?.( base64);
    } catch {
      message.error('图片读取失败');
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleSetFile(files[0]);
    e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          handleSetFile(file);
          return;
        }
      }
    }
    message.info('剪贴板没有识别到图片');
  };

  const handleClear = () => {
    setFileName('');
    onChange?.( '');
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Input
        value={fileName}
        placeholder="Ctrl+V粘贴图片 或 点击浏览选择本地图片"
        disabled={disabled}
        onPaste={handlePaste}
        style={{ flex: 1 }}
        allowClear
        onClear={handleClear}
      />
      <Button
        icon={<UploadOutlined />}
        onClick={handleBrowseClick}
        disabled={disabled}
        type="primary"
      >
        浏览
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleNativeFileChange}
      />
    </div>
  );
}

export default ImageFilePicker;