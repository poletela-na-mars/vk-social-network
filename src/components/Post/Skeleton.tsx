import ContentLoader from 'react-content-loader';

export const Skeleton = () => {
  return (
      <ContentLoader
          speed={2}
          width={191}
          height={143}
          viewBox="0 0 191 143"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="10" ry="10" width="50" height="50" />
        <rect x="63" y="0" rx="10" ry="10" width="127" height="19" />
        <rect x="63" y="24" rx="10" ry="10" width="127" height="24" />
        <rect x="0" y="62" rx="10" ry="10" width="191" height="34" />
        <rect x="0" y="106" rx="20" ry="20" width="64" height="36" />
      </ContentLoader>
  );
};
