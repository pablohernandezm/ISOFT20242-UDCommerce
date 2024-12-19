CREATE VIEW business_reviews_summary AS
SELECT
	business_id,
	COUNT(*) AS review_count,
	SUM(rate) AS total_rate
FROM
	public.reviews
GROUP BY
	business_id;
