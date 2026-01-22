export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ChapterLatest {
  filename: string;
  chapter_name: string;
  chapter_title?: string;
  chapter_api_data: string;
}

export interface Chapter {
  server_name: string;
  server_data: ChapterData[];
}

export interface ChapterData {
  filename: string;
  chapter_name: string;
  chapter_title?: string;
  chapter_api_data: string;
}

export interface ChapterContentResponse {
  status: string;
  message: string;
  data: {
    domain_cdn: string;
    item: {
      _id: string;
      comic_name: string;
      chapter_name: string;
      chapter_title: string;
      chapter_path: string;
      chapter_image: {
        image_page: number;
        image_file: string;
      }[];
    };
  };
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

export interface StoryDetails extends Story {
  content: string;
  author: string[];
  chapters: Chapter[];
}

export interface SearchApiResponse {
  status: string;
  message: string;
  data: {
    items: StoryDetails[];
    APP_DOMAIN_CDN_IMAGE: string;
    params: any;
    seoOnPage: any;
    titlePage: string;
    breadCrumb: any[];
  };
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: {
    item: T;
    APP_DOMAIN_CDN_IMAGE: string;
    seoOnPage: {
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
      updated_time: number;
    };
  };
}

export interface Pagination {
  totalItems: number;
  totalItemsInPage: number;
  currentPage: number;
  pageRange: number;
}

export interface GenresApiResponse {
  status: string;
  message: string;
  data: {
    items: Category[];
  };
}

