export class FileEntity{
    name:string
    path:string
    type: 'file' | 'folder';
    thumbnails: string[] = [];
    liked: boolean

    currentSecond?: number;
    duration?: number;
    progress?: number;
    continueImage?: string;
}