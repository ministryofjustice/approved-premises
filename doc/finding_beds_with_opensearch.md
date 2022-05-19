# Finding beds with OpenSearch

## Background

We need to identify beds which:

- have certain characteristics which may belong to their Approved Premises (Female, high-security, PIPE) or to their room (arson-proof, en-suite)
- are within a reasonable distance of the given target location
- are expected to be available for (at least most of) the given date range

## Geospatial ranking

Available beds which meet all the required criteria should be listed according to proximity to the given target location. e.g. a women's Approved Premises in Leeds will be ranked above Preston if a place near Leeds is requested.

However, if a bed in Leeds is not available during the requested date range then Preston should be ranked above Leeds.

## Availability ranking

Approved Premisess with available beds should be ranked above those without suitable availability for the given date range. However, availability should not be considered as a binary match as many placements are not taken up and many end either earlier or later than planned. For this reason it's important that staff see "near-misses" and are able to make a judgement as to whether, by the time of the "start date", the Approved Premises is likely to be able to accommodate the expected needs of the person being released from prison.

If availability for Leeds differs slightly from what's required (e.g. Leeds has availability for the date range apart from the final 2 weeks) it might be considered a better match than a place in Liverpool which is available for the entire given date range. Leeds should be shown in the "amber" category of near-miss results, rather than being omitted for failing to be a perfect match on availability.

## Proof of concept

We've demonstrated the ability to independently score these dimensions of:

- room / premises characteristic
- availability
- distance

We anticipate that the Beta team will want to build an extensive test suite which allows the "matching algorithm" to be refined against:

- a realistic set of bookings and
- a varied corpus of queries and expected rankings

In this way the effectiveness of the matcher can be systematically improved. As deficiencies are uncovered new test examples can be added to the suite.

## Scoring techniques

Our ranking requirements are quite involved and so we've used the power tool of OpenSearch scoring and are using a [`function_score` query](https://www.elastic.co/guide/en/elasticsearch/reference/8.2/query-dsl-function-score-query.html
) to redefine the original `query_score` of each result.

In the following example, we are seeking accommodation in:

> a female AP with step-free access to communal area, as close to Leeds as possible, with availability from Aug 1 to Oct 10th.

Our `function_score` function takes:

- an unfiltered `query`: this query is performed before scoring to exclude all but female APs as we don't wish to display any male facilities in the results.

- a list of functions, in our case:
  - `filter` on availability, expressed as `must_not` match the date range of bookings. Uses the `intersects` range query matcher on the date ranges of bookings. This is weighted `40`.
  - `filter` on room characteristics, in this case "step-free access", expressed with `should` and boosted. The filter is weighted `20`.
  - `gauss` to ['decay' the score](https://www.elastic.co/guide/en/elasticsearch/reference/8.2/query-dsl-function-score-query.html#function-decay
) as the distance from the `origin` or given target location increases. The rate of decay is set with `scale` at 50 miles.

## Example query

```json
{
  "size": "4",
  "query": {
    "function_score": {
      "query": {
        "term": {
          "gender": {
            "value": "F"
          }
        }
      },
      "functions": [
        {
          "filter": {
            "bool": {
              "must_not": {
                "range": {
                  "bookings": {
                    "lte": "2022-10-10T00:00:00.000Z",
                    "gte": "2022-07-31T23:00:00.000Z",
                    "relation": "intersects"
                  }
                }
              }
            }
          },
          "weight": 40
        },
        {
          "gauss": {
            "location": {
              "origin": {
                "lat": 53.7901124,
                "lon": -1.560001909
              },
              "scale": "50miles"
            }
          },
          "weight": 20
        },
        {
          "filter": {
            "bool": {
              "should": [
                {
                  "term": {
                    "step_free_access_to_communal_areas": {
                      "value": true,
                      "boost": 1
                    }
                  }
                }
              ]
            }
          },
          "weight": 20
        }
      ]
    }
  },
  "stored_fields": [
    "_source"
  ],
  "script_fields": {
    "distance": {
      "script": {
        "inline": "doc['location'].arcDistance(params.lat,params.lon) * 0.00062137",
        "lang": "painless",
        "params": {
          "lat": 53.7901124,
          "lon": -1.560001909
        }
      }
    }
  }
}
```
Note the use of the `script_fields` key to define how we use the ['painless' scripting language](https://www.elastic.co/guide/en/elasticsearch/painless/8.2/painless-walkthrough.html
) to calculate a `distance` value in miles for each result.
