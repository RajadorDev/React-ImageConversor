import { ImageType, ImageTypesManager } from "../services/image-converter";

import '../css/image-type-list.css';

export default function ImageTypeList(props: {exclude: Array<ImageType>, changeSelect: (imageSelected: ImageType) => void, defaultSelected?: ImageType|undefined}) {

    const elements = [];
    let currentkey = 0;
    for (let type of ImageTypesManager.all()) {
        const ignoreType = props.exclude.includes(type);
        elements.push(
            <div key={currentkey} className={
                "img-radio-container" + (ignoreType ? ' ignore-container' : '') 
            }>
                <label htmlFor={type.displayName} className="image-radio-label">
                    {type.displayName}
                </label>
                <input
                    type="radio" 
                    name="image-type" 
                    id={type.displayName} 
                    className="image-type-radio" 
                    disabled={ignoreType} 
                    checked={props.defaultSelected === type} 
                    onChange={
                        event => {
                            const check = event.currentTarget.checked;
                            console.log('is check', check);
                            if (check) {
                                props.changeSelect(type);
                            }
                        }
                    }
                />
            </div>
        );
        currentkey++;
    }
    return <div className="image-type-list-box">
        {elements}
    </div>
}