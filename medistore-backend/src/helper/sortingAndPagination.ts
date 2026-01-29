type IOptions = {
  page?: number;
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
};

export type IOptionsResult = {
  page?: number;
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
  skipPage: number;
};

function sortingAndPagination(payload: IOptions): IOptionsResult {
  const page = Number(payload.page) || 1;
  const limit = Number(payload.limit) || 5;
  const sortBy = payload.sortBy || "createdAt";
  const sortOrder = payload.sortOrder || "desc";

  const skipPage = (page - 1) * limit || 0;

  return {
    page,
    sortBy,
    limit,
    sortOrder,
    skipPage,
  };
}

export default sortingAndPagination;
