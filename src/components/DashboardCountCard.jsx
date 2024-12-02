import classes from './DashboardCountCard.module.css';

export default function DashboardCountCard({ count, label, icon }) {
  return (
    <div className={classes.card}>
      <div className={classes.textContainer}>
        <div className={classes.label}>{label}</div>
        <div className={classes.count}>{count}</div>
      </div>
      <div className={classes.iconContainer}>
        {icon}
      </div>
    </div>
  );
}