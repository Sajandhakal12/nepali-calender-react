import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.css'

// variables & functions
import { bsDays, adDays, bsMonths, bsMonthsEnglish } from './variables'
import { currentYear, getYears } from './dates'
import { BikramSambatConverter } from './bsdate-converter'

const date = new BikramSambatConverter()

export const Calender = ({
  language,
  mode,
  onDateClicked,
  startDate,
  dayClickBehaviour
}) => {
  const tempDate = new Date(startDate)
  const nepaliDate = date.engToNepali(
    tempDate.getFullYear(),
    tempDate.getMonth() + 1,
    tempDate.getDate()
  )

  const activeDate = nepaliDate
  const [year, setYear] = useState(nepaliDate.year)
  const [month, setMonth] = useState(nepaliDate.nmonth)
  const [clickedDates, setClickedDates] = useState([])

  const yearInfo = currentYear(year)
  const currMonth = yearInfo[month - 1]
  const years = getYears()

  const handleDateClick = (year, month, date, day) => {
    if (dayClickBehaviour === 'multiple') {
      const tempClickedDates = [...clickedDates]
      const index = tempClickedDates.findIndex(
        (clickedDate) =>
          clickedDate.year === year &&
          clickedDate.month === month &&
          clickedDate.day === day &&
          clickedDate.date === date
      )

      if (index !== -1) {
        tempClickedDates.splice(index, 1)
        setClickedDates(tempClickedDates)
        return onDateClicked(tempClickedDates)
      }
      tempClickedDates.push({ year, month, date, day })
      setClickedDates(tempClickedDates)
      return onDateClicked(tempClickedDates)
    }
    setClickedDates([{ year, month, date, day }])
    return onDateClicked({ year, month, date, day })
  }
  const handleMonthChange = (e) => {
    clearDates()
    setMonth(e.target.value * 1)
  }
  const handleYearChange = (e) => {
    clearDates()
    setYear(e.target.value * 1)
  }
  const clearDates = () => {
    setClickedDates([])
  }

  return (
    <main className={styles.calendarContain}>
      <div style={{ textAlign: 'center' }}>
        {mode === 'yearly' ? (
          <React.Fragment>
            <select id='year' value={year} onChange={handleYearChange}>
              {years.map((year) => (
                <option key={year} value={year}>
                  {language === 'nepali' ? date.toNepaliNumber(year) : year}
                </option>
              ))}
            </select>

            <select id='month' value={month} onChange={handleMonthChange}>
              {language === 'nepali'
                ? bsMonths.map((month, i) => (
                    <option key={month} value={i + 1}>
                      {month}
                    </option>
                  ))
                : bsMonthsEnglish.map((month, i) => (
                    <option key={month} value={i + 1}>
                      {month}
                    </option>
                  ))}
            </select>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <select id='month' value={month} onChange={handleMonthChange}>
              {language === 'nepali'
                ? bsMonths.map((month, i) => (
                    <option key={month} value={i + 1}>
                      {month}
                    </option>
                  ))
                : bsMonthsEnglish.map((month, i) => (
                    <option key={month} value={i + 1}>
                      {month}
                    </option>
                  ))}
            </select>
          </React.Fragment>
        )}
      </div>
      <section className={styles.calendarDays}>
        <section className={styles.calendarTopbar}>
          {language === 'nepali'
            ? bsDays.map((day, i) => (
                <span
                  key={i}
                  className={`${styles.topbarDays} ${
                    i + 1 === 7 && styles.saturday
                  }`}
                >
                  {day}
                </span>
              ))
            : adDays.map((day, i) => (
                <span key={i} className={styles.topbarDays}>
                  {day}
                </span>
              ))}
        </section>
        {Array.from(
          {
            length: Math.ceil((currMonth.weekStart + currMonth.endDate) / 7)
          },
          (_, i) => i + 1
        ).map((num) => (
          <section key={num} className={styles.calendarWeek}>
            {num === 1 &&
              Array.apply(null, { length: currMonth.weekStart }).map((e, i) => (
                <div
                  key={i}
                  className={`${styles.calendarDay} ${styles.inactive}`}
                >
                  <span className={styles.calendarDate}> </span>
                </div>
              ))}
            {Array.apply(null, {
              length:
                num === 1
                  ? 7 - currMonth.weekStart
                  : num ===
                    Math.ceil((currMonth.weekStart + currMonth.endDate) / 7)
                  ? 7 -
                    (Math.ceil((currMonth.weekStart + currMonth.endDate) / 7) *
                      7 -
                      currMonth.endDate -
                      currMonth.weekStart)
                  : 7
            }).map((e, i) => (
              <div
                key={i}
                className={`${styles.calendarDay} ${
                  clickedDates &&
                  clickedDates.every(
                    (date) =>
                      date.date !==
                      Math.max(0, 7 * (num - 1) - currMonth.weekStart) + (i + 1)
                  )
                    ? null
                    : styles.active
                } ${
                  activeDate.date ===
                    Math.max(0, 7 * (num - 1) - currMonth.weekStart) +
                      (i + 1) &&
                  activeDate.nmonth === month &&
                  activeDate.year === year &&
                  styles.today
                } ${
                  (Math.max(0, 7 * (num - 1) - currMonth.weekStart) +
                    (i + 1) +
                    currMonth.weekStart) %
                    7 ===
                    0 && styles.holiday
                }`}
                onClick={() =>
                  handleDateClick(
                    year,
                    month,
                    Math.max(0, 7 * (num - 1) - currMonth.weekStart) + (i + 1),
                    (Math.max(0, 7 * (num - 1) - currMonth.weekStart) +
                      (i + 1) +
                      currMonth.weekStart) %
                      7 ===
                      0
                      ? 7
                      : (Math.max(0, 7 * (num - 1) - currMonth.weekStart) +
                          (i + 1) +
                          currMonth.weekStart) %
                          7
                  )
                }
              >
                <span className={styles.calendarDate}>
                  {language === 'nepali'
                    ? date.toNepaliNumber(
                        Math.max(0, 7 * (num - 1) - currMonth.weekStart) +
                          (i + 1)
                      )
                    : Math.max(0, 7 * (num - 1) - currMonth.weekStart) +
                      (i + 1)}
                </span>
              </div>
            ))}
            {num === Math.ceil((currMonth.weekStart + currMonth.endDate) / 7) &&
              Array.apply(null, {
                length:
                  Math.ceil((currMonth.weekStart + currMonth.endDate) / 7) * 7 -
                  currMonth.endDate -
                  currMonth.weekStart
              }).map((e, i) => (
                <div
                  key={i}
                  className={`${styles.calendarDay} ${styles.inactive}`}
                >
                  <span className={styles.calendarDate}> </span>
                </div>
              ))}
          </section>
        ))}
      </section>
    </main>
  )
}

Calender.defaultProps = {
  language: 'english',
  mode: 'monthly',
  onDateClicked: () => {},
  dayClickBehaviour: 'single',
  startDate: new Date()
}

Calender.propTypes = {
  language: PropTypes.string,
  mode: PropTypes.string,
  onDateClicked: PropTypes.func.isRequired,
  dayClickBehaviour: PropTypes.string,
  startDate: PropTypes.any
}

export const useNepaliNUmber = (number) => {
  return date.toNepaliNumber(number)
}
