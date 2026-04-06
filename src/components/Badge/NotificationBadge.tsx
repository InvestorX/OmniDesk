/**
 * 通知バッジコンポーネント
 * 
 * 桜ピンクのテーマに映えるネオンブルー (#00d4ff) を使用し、
 * 出現時のポップアニメーションとホバー時の拡大エフェクトを付与しています。
 * 
 * @param props.count - 未読通知数
 * @return React.JSX.Element | null - バッジ（count > 0 のとき） or null
 */
export function NotificationBadge({ count }: { count: number }): React.JSX.Element | null {
  if (count <= 0) return null;
  const displayCount = count > 9 ? "9+" : String(count);
  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-badge)] text-[10px] font-bold text-white shadow-[0_0_10px_var(--color-badge)] ring-2 ring-white dark:ring-[#0d1117] animate-badge-pop transition-transform hover:scale-110">
      {displayCount}
    </span>
  );
}
