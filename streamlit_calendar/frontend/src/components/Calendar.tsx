import "../styles/Calendar.css"

import {
    CalendarOptions,
    DateSelectArg,
    EventApi,
    EventSourceInput,
    ViewApi,
} from "@fullcalendar/core"
import FullCalendar from "@fullcalendar/react"

import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import multiMonthPlugin from "@fullcalendar/multimonth"
import timeGridPlugin from "@fullcalendar/timegrid"

import ptBrLocale from '@fullcalendar/core/locales/pt-br';


import React, { useRef } from "react"
import { Streamlit, withStreamlitConnection } from "streamlit-component-lib"
import { ComponentProps } from "streamlit-component-lib/dist/StreamlitReact"
import styled from "styled-components"
import {
  Callback,
  DateClickComponentValue,
  DateClickValue,
  SelectComponentValue,
  SelectValue,
  ViewValue,
} from "../types/Calendar.type"

const ENABLED_PLUGINS = [
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  multiMonthPlugin,
  timeGridPlugin,
]

const FullCalendarWrapper = styled.div<{ $customCSS?: string }>`
  ${(props) => props.$customCSS}
`

type Props = ComponentProps<{
  events?: EventSourceInput
  options?: CalendarOptions
  custom_css?: string
  callbacks?: Callback[]
}>

const CalendarFC: React.FC<Props> = ({
  args: { events, options, custom_css, callbacks },
}) => {
  const calendarRef = useRef<FullCalendar>(null)

  const getViewValue = (view: ViewApi): ViewValue => ({
    type: view.type,
    title: view.title,
    activeStart: view.activeStart.toISOString(),
    activeEnd: view.activeEnd.toISOString(),
    currentStart: view.currentStart.toISOString(),
    currentEnd: view.currentEnd.toISOString(),
  })

  // Use a WeakMap to associate elements with their listeners
  const mouseEnterListeners = React.useRef(new WeakMap<HTMLElement, EventListener>()).current;

  // This is called by FullCalendar for each event after it is mounted
  const handleEventDidMount = (info: { event: EventApi; el: HTMLElement; view: ViewApi }) => {
    if (callbacks?.includes("eventMouseEnter")) {
      // Remove any previous listener to avoid duplicates
      const prevListener = mouseEnterListeners.get(info.el);
      if (prevListener) {
        info.el.removeEventListener("mouseenter", prevListener);
      }
    }
  }

  const handleDateClick = (arg: DateClickArg) => {
    const dateClick: DateClickValue = {
      allDay: arg.allDay,
      date: arg.date.toISOString(),
      view: getViewValue(arg.view),
    }

    const componentValue: DateClickComponentValue = {
      callback: "dateClick",
      dateClick,
    }

    Streamlit.setComponentValue(componentValue)
  }

  const handleSelect = (arg: DateSelectArg) => {
    const select: SelectValue = {
      allDay: arg.allDay,
      start: arg.start.toISOString(),
      end: arg.end.toISOString(),
      view: getViewValue(arg.view),
    }

    const componentValue: SelectComponentValue = {
      callback: "select",
      select,
    }

    Streamlit.setComponentValue(componentValue)
  }

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
        dateClick={
          callbacks?.includes("dateClick") ? handleDateClick : undefined
        }
        select={
          callbacks?.includes("select") ? handleSelect : undefined
        }
        eventDidMount={
          callbacks?.includes("eventMouseEnter") ? handleEventDidMount : undefined
        }
        {...options}
      />
    </FullCalendarWrapper>
  )
}

export default withStreamlitConnection(CalendarFC)
