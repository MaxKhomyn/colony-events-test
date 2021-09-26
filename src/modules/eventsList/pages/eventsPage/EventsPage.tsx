import React from 'react';
import { Layout } from '../../../common/components/layout/Layout';
import { EventsComponent } from '../../components/eventsComponent/EventsComponent';

export const EventsPage: React.FC = () => {

    return (
        <Layout>
            <EventsComponent />
        </Layout>
    )
}
