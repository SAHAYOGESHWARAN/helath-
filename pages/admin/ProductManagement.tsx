
import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';

const ProductManagement: React.FC = () => {
    return (
        <div>
            <PageHeader title="Product Management" />
            <Card>
                <p>Product management interface will be implemented here. This will allow for adding, editing, and deleting products or services offered.</p>
            </Card>
        </div>
    );
};

export default ProductManagement;