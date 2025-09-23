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