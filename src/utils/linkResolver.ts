import { Link, RichText, Date } from 'prismic-reactjs';

export function linkResolver(doc) {
  switch (doc.type) {
    case 'category':
      return `/category/${doc.uid}`;
    case 'product':
      return `/product/${doc.uid}`;
    case 'page':
      return `/${doc.uid}`;
    default:
      return '/';
  }
}
