import Image from 'next/image';

interface MDXImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

const MDXImage: React.FC<MDXImageProps> = ({
  src,
  alt = 'Image',
  width = 200,
  height = 200,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      layout='responsive'
    />
  );
};

export default MDXImage;
