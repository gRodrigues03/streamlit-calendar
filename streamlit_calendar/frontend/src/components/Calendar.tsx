import "../styles/Calendar.css"

import {
    CalendarOptions,
    EventSourceInput,
} from "@fullcalendar/core"
import FullCalendar from "@fullcalendar/react"

import dayGridPlugin from "@fullcalendar/daygrid"
import multiMonthPlugin from "@fullcalendar/multimonth"

import ptBrLocale from '@fullcalendar/core/locales/pt-br';


import React, { useRef } from "react"
import { Streamlit, withStreamlitConnection } from "streamlit-component-lib"
import { ComponentProps } from "streamlit-component-lib/dist/StreamlitReact"
import styled from "styled-components"

const ENABLED_PLUGINS = [
  dayGridPlugin,
  multiMonthPlugin,
]

const FullCalendarWrapper = styled.div<{ $customCSS?: string }>`
  ${(props) => props.$customCSS}
`

type Props = ComponentProps<{
  events?: EventSourceInput
  options?: CalendarOptions
  custom_css?: string
}>

const CalendarFC: React.FC<Props> = ({
  args: { events, options, custom_css },
}) => {
  const calendarRef = useRef<FullCalendar>(null)

  React.useEffect(() => {
    Streamlit.setFrameHeight()
  }, [])

  return (
    <FullCalendarWrapper $customCSS={custom_css}>
      <FullCalendar
        ref={calendarRef}
        plugins={ENABLED_PLUGINS}
        events={events}
        locale={ptBrLocale}
        {...options}
      />
    </FullCalendarWrapper>
  )
}

export default withStreamlitConnection(CalendarFC)
