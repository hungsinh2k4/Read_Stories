import React from 'react';
import Skeleton from './Skeleton';

interface StoryCardSkeletonProps {
    showTimeBadge?: boolean;
}

/**
 * Skeleton cho một story card - tái sử dụng trong grid
 */
export const StoryCardSkeleton: React.FC<StoryCardSkeletonProps> = ({ showTimeBadge = true }) => (
    <div className="group">
        <div className="relative">
            {/* Image */}
            <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-2">
                <Skeleton className="w-full h-full" />
                {showTimeBadge && (
                    <div className="absolute top-2 left-2">
                        <Skeleton className="h-5 w-16 rounded" />
                    </div>
                )}
            </div>

            {/* Text content */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>
        </div>
    </div>
);

interface StoriesGridSkeletonProps {
    count?: number;
    columnsClassName?: string;
    showTitle?: boolean;
}

/**
 * Skeleton cho grid stories - tái sử dụng cho mọi danh sách truyện
 */
export const StoriesGridSkeleton: React.FC<StoriesGridSkeletonProps> = ({
    count = 10,
    columnsClassName = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    showTitle = false,
}) => (
    <div className="bg-gray-900 text-white py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
            {showTitle && (
                <div className="flex justify-center mb-4 sm:mb-8">
                    <Skeleton className="h-7 sm:h-8 w-48" />
                </div>
            )}
            <div className={`grid ${columnsClassName} gap-2 sm:gap-4`}>
                {Array.from({ length: count }).map((_, i) => (
                    <StoryCardSkeleton key={i} />
                ))}
            </div>
        </div>
    </div>
);

/**
 * Skeleton cho Hero section
 */
export const HeroSkeleton: React.FC = () => (
    <div className="relative rounded-lg overflow-hidden mb-6 sm:mb-8">
        <div className="relative h-56 sm:h-72 md:h-96 w-full">
            <Skeleton className="w-full h-full rounded-none" />
        </div>
        <div className="bg-gray-800 p-4 sm:p-6 rounded-b-lg">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                    <Skeleton className="h-6 sm:h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <div className="sm:ml-6 flex-shrink-0">
                    <div className="bg-gray-700 rounded-lg p-3 sm:p-4 inline-block sm:block">
                        <Skeleton className="h-4 w-28 mb-2" />
                        <Skeleton className="h-6 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/**
 * Skeleton cho Story Detail page
 */
export const StoryDetailSkeleton: React.FC = () => (
    <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header Card */}
            <div className="bg-gray-800 rounded-2xl p-8 mb-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cover */}
                    <div className="flex-shrink-0">
                        <Skeleton className="w-64 h-80 rounded-xl" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <Skeleton className="h-10 w-3/4 mb-2" />
                            <Skeleton className="h-6 w-1/2" />
                        </div>

                        {/* Meta */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-5 w-40" />
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Skeleton className="h-12 w-32 rounded-lg" />
                            <Skeleton className="h-12 w-32 rounded-lg" />
                            <Skeleton className="h-12 w-24 rounded-lg" />
                        </div>

                        {/* CTA */}
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-2xl p-8 mb-8">
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>

            {/* Chapter list */}
            <div className="bg-gray-800 rounded-2xl p-8">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/**
 * Skeleton cho Genres page
 */
export const GenresSkeleton: React.FC = () => (
    <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                <Skeleton className="h-5 w-96 mx-auto mb-4" />
                <Skeleton className="h-4 w-40 mx-auto" />
            </div>

            {/* Featured */}
            <div className="mb-12">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* All genres */}
            <div>
                <Skeleton className="h-8 w-40 mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/**
 * Skeleton cho Search results
 */
export const SearchSkeleton: React.FC = () => (
    <div className="py-8">
        <Skeleton className="h-5 w-40 mb-6" />
        <StoriesGridSkeleton count={10} />
    </div>
);

/**
 * Skeleton cho Chapter Reader
 */
export const ChapterReaderSkeleton: React.FC = () => (
    <div className="min-h-screen bg-gray-900">
        {/* Navigation bar */}
        <div className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
            </div>
        </div>

        {/* Content */}
        <div className="pt-20 pb-8 max-w-4xl mx-auto px-4">
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-[60vh] rounded-lg" />
                ))}
            </div>
        </div>
    </div>
);

/**
 * Skeleton cho Home page (combined sections)
 */
export const HomePageSkeleton: React.FC = () => (
    <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Main content */}
                <div className="flex-1 min-w-0 space-y-8">
                    <StoriesGridSkeleton count={12} showTitle columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
                    <StoriesGridSkeleton count={12} showTitle columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
                    <StoriesGridSkeleton count={12} showTitle columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block w-72 space-y-4">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                </div>
            </div>
        </div>
    </div>
);

/**
 * Skeleton item cho story list (Favorites, History)
 */
const StoryListItemSkeleton: React.FC = () => (
    <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex gap-4">
            <Skeleton className="w-20 h-28 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                </div>
                <div>
                    <div className="flex justify-between mb-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-10" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
        </div>
    </div>
);

/**
 * Skeleton cho Favorites / History page
 */
export const FavoritesSkeleton: React.FC = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <StoryListItemSkeleton key={i} />
            ))}
        </div>
    </div>
);

export const HistorySkeleton = FavoritesSkeleton;

/**
 * Skeleton cho Profile page - sử dụng màu sáng như trang Profile thực tế
 */
export const ProfileSkeleton: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br bg-gray-900 from-gray-900 to-blue-800 p-4">
        <div className="max-w-6xl mx-auto">
            {/* Header Profile Section */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse border-4 border-purple-500" />

                    {/* User Info */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-2 mx-auto lg:mx-0" />
                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2 mx-auto lg:mx-0" />
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-6 mx-auto lg:mx-0" />

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-gray-50 rounded-2xl p-4 text-center">
                                    <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex overflow-x-auto bg-gray-50 border-b">
                    <div className="px-8 py-4 bg-gray-200 animate-pulse w-32 rounded" />
                </div>

                {/* Tab Content */}
                <div className="p-8">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                    <div className="space-y-6 max-w-2xl">
                        <div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
                        </div>
                        <div>
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-6">
                            <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse" />
                            <div className="h-12 w-20 bg-gray-100 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/**
 * Skeleton cho CompletedStories / NewStories page
 */
export const CompletedStoriesSkeleton: React.FC = () => (
    <StoriesGridSkeleton
        count={18}
        showTitle
        columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    />
);

