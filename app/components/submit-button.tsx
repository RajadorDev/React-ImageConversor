
import { MouseEventHandler } from 'react';
import '../css/submit-button.css';

export default function SubmitButton(props: {
    text: string,
    onClick: MouseEventHandler<HTMLButtonElement>,
    disable: boolean
}) {
    return <button className="submit-button" onClick={props.onClick} disabled={props.disable}>
        {props.text}
    </button>
}