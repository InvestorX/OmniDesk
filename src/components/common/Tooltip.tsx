import { type ReactNode } from "react";
import { classNames } from "../../utils/classNames";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

/**
 * 汎用ツールチップコンポーネント
 * @param props.content - 表示テキスト
 * @param props.children - ラップする子要素
 * @return React.JSX.Element
 */
export function Tooltip({ content, children }: TooltipProps): React.JSX.Element {
  return (
    <div className="group relative flex items-center">
      {children}
      <div className={classNames(
        "absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50",
        "group-hover:opacity-100 group-hover:delay-300"
      )}>
        {content}
      </div>
    </div>
  );
}
