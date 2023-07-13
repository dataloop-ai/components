export enum MediaTypeEnum {
    image = 'Image',
    video = 'Video',
    lidar = 'Lidar'
}

export type TChips = {
    name: string
    color: string
}

export type ImageMetadata = {
    url: string
    name: string
    extension: string
    createdAt: Date
    updatedAt: Date
    mediaType: MediaTypeEnum
    state?: string
    /*
    title: string,
    counter: number,
    innerIcons: Array<string>,
    chips: Array<TChips>,
    description: string,
    coloredStrip: string,
    */
}
