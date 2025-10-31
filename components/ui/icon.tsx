import { ComponentType } from "react";
import { SvgProps } from "react-native-svg";

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

/**
 * Wrapper para ícones SVG com props consistentes.
 *
 * Uso direto do SVG:
 * ```tsx
 * import { BeerIcon } from '@/assets/icons';
 * <BeerIcon width={24} height={24} fill="#1D9BF0" />
 * ```
 *
 * Uso com wrapper (opcional):
 * ```tsx
 * import { Icon } from '@/components/ui/icon';
 * import { BeerIcon } from '@/assets/icons';
 * <Icon icon={BeerIcon} size={24} color="#1D9BF0" />
 * ```
 */
export function Icon({
  icon: IconComponent,
  size = 24,
  color = "#000",
  ...props
}: IconProps & { icon: ComponentType<SvgProps> }) {
  return <IconComponent width={size} height={size} fill={color} {...props} />;
}
