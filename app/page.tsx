'use client';
import ImageInput from "./components/image-input";
import { convertImageFromInput, downloadImage, ImageInputInfo, ImageType, ImageTypesManager, onInput } from "./services/image-converter";

import './css/main-page.css';
import { useState } from "react";
import ImageTypeList from "./components/image-type-list";
import SubmitButton from "./components/submit-button";

function convert(event: React.FormEvent<HTMLInputElement>): void {
    const files = event.currentTarget.files;
    if (files !== null && 0 in files) {
        const file = files[0];
        const imageType = ImageTypesManager.findImageType(file);
        if (imageType) {
            console.log('Image type ' + imageType.displayName);
            file.bytes().then(
                bytes => {
                    console.log('converting to PNG');
                    ImageTypesManager.get('jpeg')?.convert({
                        imageType: imageType,
                        file
                    },
                    'jpeg' + file.name + '.jpeg'
                    ).then(
                        result => downloadImage(result)
                    )
                }
            )
            
        }
    }
}

export default function Home() {

    const [currentInputInfo, changeInputInfo] = useState<ImageInputInfo>({});

    let excludeTypes: ImageType[] = [];

    if (currentInputInfo.beingConverted) {
        excludeTypes = ImageTypesManager.all().toArray();
    } else if (currentInputInfo.type) {
        excludeTypes = [currentInputInfo.type];
    }
    return (
        <main>
            <h1>Image Converter</h1>

            <ImageInput 
                text="Image file" onInput={
                    event => {
                        const result = !currentInputInfo.beingConverted ? onInput(event) : null;
                        if (result) {
                            changeInputInfo(result);
                        } else {
                            event.preventDefault();
                        }
                    }
                } 

                allowedExtensions={ImageTypesManager.getAllowedExtensions().join(',')}>
            </ImageInput>

            <ImageTypeList 
                defaultSelected={currentInputInfo.convertTypeSelected}
                exclude={excludeTypes}
                changeSelect={
                    newImageType => {
                        if (!currentInputInfo.beingConverted) {
                            changeInputInfo({
                                ...currentInputInfo,
                                convertTypeSelected: newImageType
                            });
                        }
                    }
                }
            >

            </ImageTypeList>

            <SubmitButton onClick={
                event => {
                    if (currentInputInfo.beingConverted || !currentInputInfo.type || !currentInputInfo.convertTypeSelected) {
                        event.preventDefault();
                        return;
                    } 
                    
                    convertImageFromInput(currentInputInfo).then(
                        file => {
                            downloadImage(file);
                        }
                    );
                    
                }
            } disable={currentInputInfo.beingConverted || !currentInputInfo.type} text="Convert">
        </SubmitButton>
        </main>
    );
}
