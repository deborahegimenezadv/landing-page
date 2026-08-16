type ImagePlaceholderProps = {
  label: string;
  className?: string;
  rounded?: boolean;
};

// TODO: substituir por imagem real quando as fotos/mapa estiverem disponíveis
export function ImagePlaceholder({
  label,
  className = "",
  rounded = false,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-line bg-cream text-center text-xs text-muted ${
        rounded ? "rounded-[4px]" : "rounded-[3px]"
      } ${className}`}
    >
      <span className="px-4">{label}</span>
    </div>
  );
}
