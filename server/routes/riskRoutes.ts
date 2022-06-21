import { Router } from 'express'

import { mapOasysSectionsToTableRows, OasysSection } from './helpers/mapOasysSectionsToTableRows'
import { get } from './index'

export default function RiskRoutes(router: Router): Router {
  get(router, '/risks/summary', (req, res, next) => {
    const risks = {
      risks: {
        mappa: {
          level: 'CAT 2/LEVEL 1',
          isNominal: false,
          lastUpdated: '10th October 2021',
        },
        flags: ['Hate Crime'],
        roshRiskSummary: {
          overallRisk: 'VERY_HIGH',
          riskToChildren: 'LOW',
          riskToPublic: 'VERY_HIGH',
          riskToKnownAdult: 'MEDIUM',
          riskToStaff: 'HIGH',
          lastUpdated: '10th October 2021',
        },
      },
    }

    const tableHeadings: Array<{ text: string }> = [
      {
        text: '',
      },
      {
        text: 'OASys Section',
      },
      {
        text: 'Linked to RoSH',
      },
      {
        text: 'Linked to offending',
      },
      {
        text: 'Score',
      },
    ]

    const seriousHarmSections: Array<OasysSection> = [
      {
        number: 8,
        name: 'Drug misuse',
        id: 'drug-misuse',
        linkedToRosh: true,
        linkedToOffending: true,
        score: 'high',
        checked: true,
      },
      {
        number: 9,
        name: 'Alcohol misuse',
        id: 'alcohol-misuse',
        linkedToRosh: true,
        linkedToOffending: true,
        score: 'high',
        checked: true,
      },
      {
        number: 11,
        name: 'Thinking & behaviour',
        id: 'thinking-and-behaviour',
        linkedToRosh: true,
        linkedToOffending: false,
        score: 'medium',
        checked: true,
      },
      {
        number: 12,
        name: 'Attitudes',
        id: 'attitudes',
        linkedToRosh: true,
        linkedToOffending: true,
        score: 'high',
        checked: true,
      },
    ]

    const needsLinkedToReoffendingSections: Array<OasysSection> = [
      {
        number: 3,
        name: 'Accomodation',
        id: 'accomodation',
        linkedToRosh: false,
        linkedToOffending: true,
        score: 'medium',
      },
      {
        number: 6,
        name: 'Relationships',
        id: 'relationships',
        linkedToRosh: false,
        linkedToOffending: true,
        score: 'medium',
      },
      {
        number: 10,
        name: 'Emotional well-being',
        id: 'emotional-well-being',
        linkedToRosh: false,
        linkedToOffending: true,
        score: 'medium',
      },
    ]

    const needsNotLinkedToSeriousHarmOrReoffendingSections: Array<OasysSection> = [
      { number: 4, name: 'ETE', id: 'ete', linkedToRosh: false, linkedToOffending: false, score: 'low' },
      {
        number: 7,
        name: 'Lifestyle & associates',
        id: 'lifestyle-and-associates',
        linkedToRosh: false,
        linkedToOffending: false,
        score: 'low',
      },
      { number: 13, name: 'Health', id: 'health', linkedToRosh: false, linkedToOffending: false, score: 'low' },
    ]

    const seriousHarmTableRows = mapOasysSectionsToTableRows(seriousHarmSections, 'oasysSection[]')
    const needsLinkedToReoffendingTableRows = mapOasysSectionsToTableRows(
      needsLinkedToReoffendingSections,
      'oasysSection[]'
    )
    const needsNotLinkedToSeriousHarmOrReoffendingTableRow = mapOasysSectionsToTableRows(
      needsNotLinkedToSeriousHarmOrReoffendingSections,
      'oasysSection[]'
    )

    res.render('pages/importOasysSections', {
      risks,
      tableHeadings,
      seriousHarmTableRows,
      needsLinkedToReoffendingTableRows,
      needsNotLinkedToSeriousHarmOrReoffendingTableRow,
    })
  })

  get(router, '/risks/predictors', (req, res, next) => {
    const predictorScores = {
      current: {
        date: '23 Jul 2021 at 12:00:00',
        scores: {
          RSR: {
            level: 'HIGH',
            score: 11.34,
            type: 'RSR',
          },
          OSPC: {
            level: 'MEDIUM',
            score: 8.76,
            type: 'OSP/C',
          },
          OSPI: {
            level: 'LOW',
            score: 3.45,
            type: 'OSP/I',
          },
        },
      },
      historical: [
        {
          scores: {
            RSR: {
              level: 'HIGH',
              score: 10.3,
              type: 'RSR',
            },
            OSPC: {
              level: 'MEDIUM',
              score: 7.76,
              type: 'OSP/C',
            },
            OSPI: {
              level: 'LOW',
              score: 3.45,
              type: 'OSP/I',
            },
          },
        },
        {
          scores: {
            RSR: {
              level: 'MEDIUM',
              score: 5.34,
              type: 'RSR',
            },
            OSPC: {
              level: 'MEDIUM',
              score: 6.76,
              type: 'OSP/C',
            },
            OSPI: {
              level: 'LOW',
              score: 3.45,
              type: 'OSP/I',
            },
          },
        },
      ],
    }

    res.render('pages/riskPredictors', { predictorScores })
  })

  return router
}
