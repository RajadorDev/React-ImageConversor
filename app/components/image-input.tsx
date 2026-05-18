'use client';

import '../css/image-input.css';

export default function ImageInput(props: {
    text: string,
    allowedExtensions: string,
    onInput: (event: React.FormEvent<HTMLInputElement>) => void
}) {
    return (
        <div className="image-input-box">
            <label htmlFor="image" className="image-input-label">
                {props.text}
            </label>
            <input className='image-input' id="image" type="file" accept={props.allowedExtensions} onInput={props.onInput}></input>
        </div>
    );
}