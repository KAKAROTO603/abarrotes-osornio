import { Skeleton } from '@mui/material';

const ProductSkeleton = () => {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm border-0">
        <Skeleton variant="rectangular" height={220} />
        <div className="card-body">
          <Skeleton variant="text" height={30} width="60%" />
          <Skeleton variant="text" height={20} width="80%" />
          <Skeleton variant="text" height={20} width="70%" />
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Skeleton variant="text" height={40} width="30%" />
            <Skeleton variant="rectangular" height={40} width="30%" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;