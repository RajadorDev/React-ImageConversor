
import { MouseEventHandler } from 'react';
import '../css/submit-button.css';

export default function SubmitButton(props: {
    text: string,
    onClick: MouseEventHandler<HTMLButtonElement>,
    disable: boolean,
    loading?: boolean
}) {
    return <button className="submit-button" onClick={props.onClick} disabled={props.disable}>
        {
            props.loading ? <div className="loading-submit-button-div"/> : props.text
        }
    </button>
}