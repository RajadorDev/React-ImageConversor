
type ImageBlob = {
     readonly imageType: ImageType,
     readonly file: File
}

export async function downloadImage(file: File) : Promise<void> {
    const url = URL.createObjectURL(file);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;

    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export class ImageType 
{

    constructor(
        public readonly displayName: string,
        public readonly extensionsNameList: Array<string>,
        public readonly identifier: string
    ) {}

    public isThisType(file: File) : boolean {
        const splittedFileName = file.name.split('.');
        const extensionName = splittedFileName.pop() as string;
        return this.extensionsNameList.includes(extensionName.toLocaleLowerCase());
    }

    public getImageHtmlIdentifier() : string 
    {
        return 'image/' + this.identifier;
    }

    public getExtensionsWithPoints() : Array<string> {
        return this.extensionsNameList.map(
            extensionName => '.' + extensionName
        );
    }

    public async convert(blob: ImageBlob, name: string) : Promise<File> {
        const bitMap = await createImageBitmap(blob.file);
        console.log('Bit map created');
        const canvas = document.createElement('canvas');
        canvas.width = bitMap.width;
        canvas.height = bitMap.height;
        const context = canvas.getContext('2d');
        context!.drawImage(bitMap, 0, 0);
        console.log('draw image');
        const outPut = await new Promise((resolver, rejector) => {
            console.log('canvas to blob');
            canvas.toBlob((blob) => {
                if (blob !== null) {
                    resolver(blob);
                } else {
                    rejector(new Error('Error while canvas to blob convert'));
                }
            }, this.getImageHtmlIdentifier());
        }) as Blob;

        return new File(
            [outPut],
            name,
            {
                type: this.getImageHtmlIdentifier()
            }
        );
    }

    public createBlob(buffer: Uint8Array) : Blob {
        return new Blob([
            buffer.toString()
        ], {
            type: this.getImageHtmlIdentifier()
        });
    }

    public generateTypeName(from: string) : string {
        const nameWithoutExtension = from.split('.').shift();
        return nameWithoutExtension + '.' + this.extensionsNameList[0];
    }
}

export class ImageTypesManager {

    private static list: Map<string,ImageType> = new Map;

    public static setup() : void {
        for (let type of [
            new ImageType('PNG', ['png'], 'png'),
            new ImageType('JPEG', ['jpeg', 'jpe', 'jpg'], 'jpeg'),
            new ImageType('WebP', ['webp'], 'webp')
        ]) {
            this.register(type);
        }
    }

    public static get(id: string) : ImageType|undefined {
        return this.list.get(id);
    }

    public static register(type: ImageType) : void {
        if (this.get(type.identifier)) {
            throw new Error('Type ' + type.identifier + ' is already registered');
        }

        this.list.set(type.identifier, type);
    }

    public static findImageType(file: File) : ImageType {
        for (let value of this.list) {
            const imageType = value[1];
            if (imageType.isThisType(file)) {
                return imageType;
            }
         }
         throw new Error('Invalid image file type');
    }

    public static getAllowedExtensions() : Array<string> {
        const extensions = [];
        for (let type of this.list.values()) {
            for (let extensionName of type.getExtensionsWithPoints()) {
                extensions.push(extensionName);
            }
        }
        return extensions;
    }

    public static all() : MapIterator<ImageType> {
        return this.list.values();
    }
}

export type ImageInputInfo = {
    type?: ImageType,
    file?: File,
    beingConverted?: boolean,
    convertTypeSelected?: ImageType
}

export function onInput(event: React.FormEvent<HTMLInputElement>) : ImageInputInfo|null {
    const files = event.currentTarget.files;
    if (files !== null && 0 in files) {
        const file = files[0];

        const imgType = ImageTypesManager.findImageType(file);

        if (imgType) {
            return {
                type: imgType,
                file: file
            };
        }
    }
    return null;
}

export async function convertImageFromInput(inputInfo: ImageInputInfo) : Promise<File> {
    const type = inputInfo.convertTypeSelected;

    if (type && inputInfo.file && inputInfo.type) {
        const file = await type.convert({
                imageType: inputInfo.type,
                file: inputInfo.file
            }, 
            type.generateTypeName(inputInfo.file.name)
        );
        return file;
    } else {
        throw new Error('Cannot convert without type, file, convertedtypeSelected properties');
    }
}

ImageTypesManager.setup();