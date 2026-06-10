import React from 'react';

interface DomeGalleryImage {
  src?: string;
  alt?: string;
}

export interface DomeGalleryProps {
  images?: (DomeGalleryImage | string)[];
  fit?: number;
  fitBasis?: string;
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
  onItemClick?: (index: number, element: HTMLElement) => void;
  disableEnlarge?: boolean;
}

export default function DomeGallery(props: DomeGalleryProps): React.JSX.Element;
