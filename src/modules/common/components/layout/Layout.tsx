import React from 'react';
import styles from './layout.module.css';

interface LayoutProps {
    children?: JSX.Element;
}

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    const { children } = props;

    return (
        <div className={styles.layout}>
            {children}
        </div>
    )
}
