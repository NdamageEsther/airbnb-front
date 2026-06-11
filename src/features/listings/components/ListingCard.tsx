import clsx from 'clsx';
import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import numeral from 'numeral';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import type { Listing } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import styles from './ListingCard.module.css';

interface ListingCardProps {
  listing: Listing;
  index: number;
}

export const ListingCard = React.memo(function ListingCard({ listing, index }: ListingCardProps)  {
  const { toggle, isSaved } = useFavorites();
  const saved = isSaved(listing.id);

  const formattedDate = format(new Date(listing.availableFrom), 'MMM d, yyyy');
  const formattedPrice = numeral(listing.price).format('$0,0');
  const formattedRating = numeral(listing.rating).format('0.00');

  return (
    <motion.div
      className={clsx(styles.card, {
        [styles.cardSaved]: saved,
        [styles.cardSuperhost]: listing.superhost,
      })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className={styles.imgWrap}>
        <img
          src={listing.img}
          alt={listing.title}
          className={styles.img}
          loading="lazy"
        />

        <div className={styles.tags}>
          {listing.superhost && (
            <span className={clsx(styles.tag, styles.tagSuperhost)}>
              Superhost
            </span>
          )}
          {listing.price > 300 && (
            <span className={clsx(styles.tag, styles.tagLuxury)}>
              Luxury
            </span>
          )}
        </div>

        <span
          className={clsx(styles.status, {
            [styles.statusAvailable]: listing.available,
            [styles.statusBooked]: !listing.available,
          })}
        >
          {listing.available ? 'Available' : 'Booked'}
        </span>

        <button
          className={clsx(styles.saveBtn, {
            [styles.saveBtnSaved]: saved,
            [styles.saveBtnUnsaved]: !saved,
          })}
          onClick={(e) => {
            e.stopPropagation();
            toggle(listing.id, listing.title);
          }}
          aria-label={saved ? 'Remove from saved' : 'Save listing'}
        >
          {saved ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.row}>
          <h3 className={styles.title}>{listing.title}</h3>
          <div className={styles.rating}>
            <FaStar />
            {formattedRating}
          </div>
        </div>

        <div className={styles.location}>
          <MdLocationOn />
          {listing.location}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            {formattedPrice} <span>/ night</span>
          </div>
          <div className={styles.date}>From {formattedDate}</div>
        </div>
      </div>
    </motion.div>
  );
});