
interface PostImageProps {
  image: string;
}

export const PostImage = ({ image }: PostImageProps) => {
  return <img src={image} alt="Post" className="w-full h-96 object-cover" />;
};
