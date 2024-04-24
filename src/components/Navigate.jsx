// Example.jsx

import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const Example = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages > 1) {
    return (
      <Pagination aria-label="Page navigation example">
        <PaginationItem>
          <PaginationLink previous onClick={() => onPageChange(currentPage - 1)} />
        </PaginationItem>
        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index} active={index + 1 === currentPage}>
            <PaginationLink onClick={() => onPageChange(index + 1)}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink next onClick={() => onPageChange(currentPage + 1)} />
        </PaginationItem>
      </Pagination>
    );
  } else {
    return null;
  }
};

export default Example;
