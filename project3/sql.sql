CREATE TEMPORARY TABLE MyTestTable (
	id varchar(64),
	name varchar(255), 
	funding_total_usd decimal(15,0), 
	price_amount decimal(15,0), 
	serieA decimal(15,0), 
	serieB decimal(15,0), 
	serieC decimal(15,0), 
	angel decimal(15,0), 
	VC decimal(15,0), 
	other decimal(15,0),
	PRIMARY KEY(id)
	);

SELECT *
FROM MyTestTable

DROP TABLE MyTestTable
Truncate MyTestTable
	
INSERT INTO MyTestTable
SELECT obj.id, name, funding_total_usd, acq.price_amount, CASE WHEN fr.funding_round_code = 'a' THEN fr.raised_amount ELSE 0 END AS 'Serie A',
CASE WHEN fr.funding_round_code = 'b' THEN fr.raised_amount ELSE 0 END AS 'Serie B',
CASE WHEN fr.funding_round_code = 'c' THEN fr.raised_amount ELSE 0 END AS 'Serie C',
CASE WHEN fr.funding_round_code = 'seed' THEN fr.raised_amount ELSE 0 END AS 'Angel',
CASE WHEN fr.funding_round_code = 'unattributed' THEN fr.raised_amount ELSE 0 END AS 'VC',
CASE WHEN fr.funding_round_code != 'a' AND fr.funding_round_code != 'b' AND fr.funding_round_code != 'c' AND fr.funding_round_code != 'seed' AND fr.funding_round_code != 'unattributed' THEN fr.raised_amount ELSE 0 END AS 'Other'
FROM cb.cb_objects as obj 
INNER JOIN cb.cb_acquisitions as acq ON obj.id = acq.acquired_object_id
INNER JOIN cb.cb_funding_rounds as fr ON obj.id = fr.object_id
WHERE (category_code = 'mobile' or category_code = 'web')
AND status = 'acquired'
AND price_amount IS NOT NULL
AND funding_total_usd IS NOT NULL
ON DUPLICATE KEY UPDATE serieA = IF(fr.funding_round_code = 'a', fr.raised_amount , serieA),
serieB = IF(fr.funding_round_code = 'b', fr.raised_amount , serieB),
serieC = IF(fr.funding_round_code = 'c', fr.raised_amount , serieC),
angel = IF(fr.funding_round_code = 'seed', fr.raised_amount , angel),
VC = IF(fr.funding_round_code = 'unattributed', fr.raised_amount , VC),
other = IF(fr.funding_round_code != 'a' AND fr.funding_round_code != 'b' AND fr.funding_round_code != 'c' AND fr.funding_round_code != 'seed' AND fr.funding_round_code != 'unattributed', fr.raised_amount , other)
;

UPDATE MyTestTable as mt
INNER JOIN cb_funding_rounds as fr ON mt.id = fr.object_id
SET mt.serieA = IF(fr.funding_round_code = 'a', fr.raised_amount , mt.serieA),
mt.serieB = IF(fr.funding_round_code = 'b', fr.raised_amount , mt.serieB),
mt.serieC = IF(fr.funding_round_code = 'c', fr.raised_amount , mt.serieC),
mt.angel = IF(fr.funding_round_code = 'seed', fr.raised_amount , mt.angel),
mt.VC = IF(fr.funding_round_code = 'unattributed', fr.raised_amount , mt.VC),
mt.other = IF(fr.funding_round_code != 'a' AND fr.funding_round_code != 'b' AND fr.funding_round_code != 'c' AND fr.funding_round_code != 'seed' AND fr.funding_round_code != 'unattributed', fr.raised_amount , mt.other)
WHERE tableA.name = 'Joe'

SELECT *
FROM MyTestTable as mt
INNER JOIN cb_funding_rounds as fr ON mt.id = fr.object_id

UPDATE MyTestTable as mt, cb_funding_rounds as fr
SET mt.serieA = 
			CASE WHEN
					fr.funding_round_code = 'a' 
					THEN fr.raised_amount
					ELSE mt.serieA
					END
WHERE mt.name = "Aardvark"

UPDATE MyTestTable as mt
INNER JOIN cb_funding_rounds as fr ON mt.id = fr.object_id
SET mt.serieA = 
			CASE WHEN
					fr.funding_round_code = 'a'
					THEN 24
					ELSE 69
					END
WHERE mt.name = "Aardvark"

UPDATE MyTestTable as mt 
SET mt.serieA = (
    SELECT raised_amount 
    FROM cb_funding_rounds as fr
    WHERE fr.object_id = mt.id
    AND fr.funding_round_code = 'a'
);

SELECT *
FROM MyTestTable as mt
INNER JOIN cb_funding_rounds as fr
ON mt.id = fr.object_id
WHERE mt.name = "Aardvark"

,
mt.serieB = IF(fr.funding_round_code = 'b', fr.raised_amount , mt.serieB),
mt.serieC = IF(fr.funding_round_code = 'c', fr.raised_amount , mt.serieC),
mt.angel = IF(fr.funding_round_code = 'seed', fr.raised_amount , mt.angel),
mt.VC = IF(fr.funding_round_code = 'unattributed', fr.raised_amount , mt.VC),
mt.other = IF(fr.funding_round_code != 'a' AND fr.funding_round_code != 'b' AND fr.funding_round_code != 'c' AND fr.funding_round_code != 'seed' AND fr.funding_round_code != 'unattributed', fr.raised_amount , mt.other)
WHERE mt.id = fr.object_id


SELECT name as "Company Name", serieA "Series A", serieB "Series B", serieC "Series C", angel "Angel", VC "VC", other "Other", funding_total_usd "Total Funding", price_amount as "Acquisition Price"
FROM MyTestTable