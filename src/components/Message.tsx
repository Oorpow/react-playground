import { FunctionComponent, useEffect, useState } from 'react';
import { CircleX } from 'lucide-react';

interface MessageProps {
	/** 错误类型 */
	type: 'error' | 'warn';
	/** 错误信息，来源于iframe */
	content: string;
}

const Message: FunctionComponent<MessageProps> = (props) => {
	const { type, content } = props;
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(!!content);
	}, [content]);

	return visible ? (
		<div
			className={`${
				type === 'error' ? 'bg-red-300' : 'bg-orange-300'
			} flex absolute bottom-3`}
		>
			<pre
				className="p-4 overflow-auto whitespace-break-spaces h-[350px]"
				dangerouslySetInnerHTML={{ __html: content }}
			></pre>
			<CircleX
				className="absolute cursor-pointer top-1 right-4"
				onClick={() => setVisible(false)}
			/>
		</div>
	) : null;
};

export default Message;
