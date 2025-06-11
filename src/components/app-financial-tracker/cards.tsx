import React from "react";
import { Badge } from "../ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

function Cards() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-col gap-12 bg-card rounded-lg p-4 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-base">My Balance</p>
              <Badge variant="outline" className="text-muted-foreground">
                {new Date(currentYear, currentMonth).toLocaleString("en-US", {
                  month: "long",
                })}
                , {currentYear}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between w-full flex-1">
            <p className="text-3xl">R$ 30.234,12</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-300/20 text-green-500">
            <TrendingUp size={16} />
            <p>27.3%</p>
          </Badge>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            Compared with last month
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-12 bg-card rounded-lg p-4 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-base">Monthly Spent</p>
              <Badge variant="outline" className="text-muted-foreground">
                {new Date(currentYear, currentMonth).toLocaleString("en-US", {
                  month: "long",
                })}
                , {currentYear}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-3xl">R$ 12.234,12</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-300/20 text-green-500">
            <TrendingUp size={16} />
            <p>08.3%</p>
          </Badge>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            Compared with last month
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-12 bg-card rounded-lg p-4 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-base">Monthly Income</p>
              <Badge variant="outline" className="text-muted-foreground">
                {new Date(currentYear, currentMonth).toLocaleString("en-US", {
                  month: "long",
                })}
                , {currentYear}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-3xl">R$ 23.632,23</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-300/20 text-red-500">
            <TrendingDown size={16} />
            <p>02.3%</p>
          </Badge>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            Compared with last month
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cards;
