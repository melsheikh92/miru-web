import React, { Fragment } from "react";

import { minToHHMM } from "helpers";
import { ClientsIcon } from "miruIcons";
import { Avatar } from "StyledComponents";

import ReportRow from "./ReportRow";

import { useEntry } from "../context/EntryContext";

interface ContainerProps {
  selectedFilter?: any;
}

const ReportHeader = () => (
  <div className="grid grid-cols-5 items-center gap-2 border-b">
    <div className="py-5 pr-6 text-left text-xs font-medium uppercase leading-4 tracking-widest text-miru-dark-purple-600">
      PROJECT/
      <br />
      CLIENT
    </div>
    <div className="col-span-2 px-6 py-5 text-left text-xs font-medium uppercase leading-4 tracking-widest text-miru-dark-purple-600">
      NOTE
    </div>
    <div className="px-6 py-5 text-left text-xs font-medium uppercase leading-4 tracking-widest text-miru-dark-purple-600">
      TEAM MEMBER/
      <br />
      DATE
    </div>
    <div className="py-5 pl-6 text-right text-xs font-medium uppercase leading-4 tracking-widest text-miru-dark-purple-600">
      HOURS
      <br />
      LOGGED
    </div>
  </div>
);

const Container = ({ selectedFilter }: ContainerProps) => {
  const { timeEntryReport } = useEntry();

  const getTotalHoursLogged = entries => {
    const totalHours = entries?.reduce((totalDuration, currentEntry) => {
      if (currentEntry?.duration) {
        totalDuration += currentEntry.duration;
      }

      return totalDuration;
    }, 0);

    return minToHHMM(totalHours || 0);
  };

  const getTableLogo = (groupedBy: string | null) => {
    const logo = {
      client: <ClientsIcon className="m-0 object-contain" size={40} />,
      project: <ClientsIcon className="m-0 object-contain" size={40} />,
      team_member: <Avatar />,
    };

    return logo[groupedBy] ? (
      <div className="mr-6 md:h-10 md:w-10">{logo[groupedBy]}</div>
    ) : null;
  };

  const getEntryList = entries =>
    entries.map((timeEntry, index) => (
      <ReportRow key={`${timeEntry.client}-${index}`} {...timeEntry} />
    ));

  const getAlphabaticallySortedReportList = (reports: any[] | null = []) =>
    reports?.sort((a, b) => {
      const firstLabel = a.label.toLowerCase();
      const secondLabel = b.label.toLowerCase();

      if (firstLabel < secondLabel) return -1;
      else if (firstLabel > secondLabel) return 1;

      return 0;
    }) || [];

  return (
    <Fragment>
      {timeEntryReport.reports?.length > 0 &&
        getAlphabaticallySortedReportList(timeEntryReport.reports)?.map(
          (report, index) => (
            <Fragment key={index}>
              {report.label !== "" && (
                <div className="flex items-center justify-between border-b border-miru-han-purple-1000 py-5">
                  <div className="flex items-center">
                    {getTableLogo(selectedFilter?.groupBy?.value || null)}
                    <h1 className="font-manrope text-xl font-bold text-miru-han-purple-1000">
                      {report.label}
                    </h1>
                  </div>
                  {report.entries?.length > 0 && (
                    <p className="text-right font-manrope text-base font-medium text-miru-dark-purple-1000">
                      Total Hours for {report.label} : &nbsp;
                      {getTotalHoursLogged(report.entries)}
                    </p>
                  )}
                </div>
              )}
              <ReportHeader />
              <div className="mb-6">
                {report.entries.length > 0 && getEntryList(report.entries)}
              </div>
            </Fragment>
          )
        )}
    </Fragment>
  );
};

export default Container;
