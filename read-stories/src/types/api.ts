export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ChapterLatest {
  filename: string;
  chapter_name: string;
  chapter_title: string;
  chapter_api_data: string;
}

export interface breadCrumb {
  name: string;
  slug?: string;
  isCurrent: boolean;
  position: number;
}

export interface Story {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  status: string;
  thumb_url: string;
  sub_docquyen: boolean;
  category: Category[];
  updatedAt: string;
  chaptersLatest: ChapterLatest[];
}

export interface SeoOnPage {
  titleHead: string;
  descriptionHead: string;
  og_type: string;
  og_image: string[];
  og_url?: string;
}

export interface HomeApiResponse {
  data: {
    seoOnPage: SeoOnPage;
    items: Story[];
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

// Category API (v1/api/the-loai/:slug?page=n)
export interface CategoryPaging {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface CategoryApiData {
  items: Story[];
  params: {
    type_list?: string;
    slug?: string;
  };
  pagination?: CategoryPaging;
  APP_DOMAIN_CDN_IMAGE?: string;
}

export interface CategoryApiResponse {
  data: CategoryApiData;
}


