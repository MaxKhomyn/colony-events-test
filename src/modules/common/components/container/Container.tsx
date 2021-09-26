import React from 'react';
import styles from './container.module.css';

interface ContainerProps {
    children?: JSX.Element| JSX.Element[];
}

export const Container: React.FC<ContainerProps> = (props: ContainerProps) => {
    const { children } = props;

    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}
