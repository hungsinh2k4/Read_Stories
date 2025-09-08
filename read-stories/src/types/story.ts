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
  
  export interface Story {
    _id: string;
    name: string;
    slug: string;
    status: string;
    thumb_url: string;
    category: Category[];
    updatedAt: string;
    chaptersLatest: ChapterLatest[];
  }
  