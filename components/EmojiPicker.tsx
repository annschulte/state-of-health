import Picker from "@emoji-mart/react";

type EmojiPickerProps = {
  onEmojiSelect: (emoji: string) => void;
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const handleEmojiSelect = (emoji: any) => {
    if ("native" in emoji) {
      onEmojiSelect(emoji.native);
    }
  };

  return (
    <Picker
      showPreview={false}
      showSkinTones={false}
      onSelect={handleEmojiSelect}
      title="Pick your emoji…"
      emoji="point_up"
      style={{ borderRadius: 0 }}
    />
  );
};
