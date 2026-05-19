'use client';
import ImageInput from "./components/image-input";
import { convertImageFromInput, downloadImage, ImageInputInfo, ImageType, ImageTypesManager, onInput } from "./services/image-converter";

import './css/main-page.css';
import { useState } from "react";
import ImageTypeList from "./components/image-type-list";
import SubmitButton from "./components/submit-button";
import GitHubCredit from "./components/github-credit";

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
                disabled={currentInputInfo.beingConverted}
                text="Select an image file" onInput={
                    event => {
                        const result = !currentInputInfo.beingConverted ? onInput(event) : null;
                        if (result) {
                            changeInputInfo(result);
                        } else {
                            event.preventDefault();
                            if (currentInputInfo.file) {
                                delete currentInputInfo.file;
                                delete currentInputInfo.type;
                                changeInputInfo({
                                    ...currentInputInfo
                                });
                            }
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

            <SubmitButton
                loading={currentInputInfo.beingConverted}
            
                onClick={
                    event => {
                        if (currentInputInfo.beingConverted || !currentInputInfo.type || !currentInputInfo.convertTypeSelected) {
                            event.preventDefault();
                            return;
                        } 
                        changeInputInfo({
                            ...currentInputInfo,
                            beingConverted: true
                        });
                        convertImageFromInput(currentInputInfo).then(
                            file => {
                                downloadImage(file);
                                changeInputInfo({
                                    ...currentInputInfo,
                                    beingConverted: false
                                });
                            }
                        );
                        
                    }
                } disable={currentInputInfo.beingConverted || !currentInputInfo.type || !currentInputInfo.convertTypeSelected} text="Convert">
            </SubmitButton>

        <GitHubCredit/>
        </main>
    );
}
