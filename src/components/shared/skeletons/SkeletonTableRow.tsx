
import React from 'react';

const SkeletonTableRow: React.FC<{ columns: number }> = ({ columns }) => {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 rounded shimmer-bg"></div>
                </td>
            ))}
        </tr>
    );
};

export default SkeletonTableRow;
