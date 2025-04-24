import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/PdfExport.css";

const PdfExport = ({ tripDetails }) => {
  const {
    journeyName,
    driverName,
    fuelCost,
    mpg,
    distance,
    passengers,
    driverContributes,
    driverContributionPercentage,
    otherCosts,
    totalFuelCost,
    totalOtherCosts,
    totalTripCost,
    costPerPerson,
    driverCost,
    passengerCost,
  } = tripDetails;

  // Color palette
  const colors = {
    beige: [242, 212, 146], // #f2d492 in RGB
    green: [184, 176, 141], // #b8b08d in RGB
    purple: [71, 64, 86], // #474056 in RGB
    lightBeige: [249, 236, 206], // Lighter version of beige for backgrounds
    white: [255, 255, 255],
  };

  const generatePDF = () => {
    // Create new document (A4 format by default)
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Add page background
    doc.setFillColor(249, 236, 206); // Light beige background
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Add header bar
    doc.setFillColor(...colors.purple);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...colors.white);
    doc.text("Journey Cost Summary", pageWidth / 2, 25, { align: "center" });

    // Add date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.lightBeige);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth - margin,
      15,
      { align: "right" }
    );

    // Journey Details Section Header
    let yPosition = 50;
    doc.setFillColor(...colors.green);
    doc.rect(margin, yPosition, pageWidth - margin * 2, 10, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...colors.purple);
    doc.text("JOURNEY DETAILS", margin + 5, yPosition + 7);
    yPosition += 20;

    // Journey information
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...colors.purple);

    // Create two-column layout for journey details
    const colWidth = (pageWidth - margin * 2) / 2;

    // Left column
    doc.text(`Journey:`, margin, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${journeyName || "Not specified"}`, margin + 50, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.text(`Driver:`, margin, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${driverName || "Not specified"}`, margin + 50, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.text(`Passengers:`, margin, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${passengers || 0}`, margin + 50, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.text(`Total travelers:`, margin, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${parseInt(passengers) + 1 || 1}`, margin + 50, yPosition);
    yPosition += 10;

    // Right column
    const rightColX = margin + colWidth;
    let rightYPosition = yPosition - 40; // Reset to start of details

    doc.setFont("helvetica", "normal");
    doc.text(`Distance:`, rightColX, rightYPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${distance || 0} miles`, rightColX + 50, rightYPosition);
    rightYPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.text(`Vehicle MPG:`, rightColX, rightYPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${mpg || 0}`, rightColX + 50, rightYPosition);
    rightYPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.text(`Fuel Price:`, rightColX, rightYPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`£${fuelCost || 0}/L`, rightColX + 50, rightYPosition);
    rightYPosition += 10;

    // Driver contribution if applicable
    if (parseInt(passengers) > 0) {
      doc.setFont("helvetica", "normal");
      doc.text(`Driver contribution:`, rightColX, rightYPosition);
      doc.setFont("helvetica", "bold");

      let contributionText = "";
      if (!driverContributes) {
        contributionText = "None";
      } else if (driverContributionPercentage < 100) {
        contributionText = `${driverContributionPercentage}%`;
      } else {
        contributionText = "Equal share";
      }

      doc.text(contributionText, rightColX + 50, rightYPosition);
    }

    // Cost Breakdown Section
    yPosition += 20;
    doc.setFillColor(...colors.green);
    doc.rect(margin, yPosition, pageWidth - margin * 2, 10, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...colors.purple);
    doc.text("COST BREAKDOWN", margin + 5, yPosition + 7);
    yPosition += 20;

    // Create boxes for costs
    const boxWidth = pageWidth - margin * 2;
    const boxHeight = 25;

    // Fuel cost box
    doc.setFillColor(...colors.beige);
    doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...colors.purple);
    doc.text("Fuel Cost:", margin + 10, yPosition + 17);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      `£${totalFuelCost.toFixed(2)}`,
      pageWidth - margin - 10,
      yPosition + 17,
      { align: "right" }
    );
    yPosition += boxHeight + 5;

    // Other costs
    if (otherCosts.length > 0) {
      otherCosts.forEach((cost, index) => {
        // Alternate background colors for better readability
        if (index % 2 === 0) {
          doc.setFillColor(...colors.lightBeige);
        } else {
          doc.setFillColor(...colors.beige);
        }

        doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(...colors.purple);
        doc.text(cost.description + ":", margin + 10, yPosition + 17);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(
          `£${parseFloat(cost.amount).toFixed(2)}`,
          pageWidth - margin - 10,
          yPosition + 17,
          { align: "right" }
        );
        yPosition += boxHeight + 5;
      });

      // Other costs total
      doc.setFillColor(...colors.green);
      doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(...colors.white);
      doc.text("Other Costs Total:", margin + 10, yPosition + 17);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(
        `£${totalOtherCosts.toFixed(2)}`,
        pageWidth - margin - 10,
        yPosition + 17,
        { align: "right" }
      );
      yPosition += boxHeight + 5;
    }

    // Total trip cost
    doc.setFillColor(...colors.purple);
    doc.rect(margin, yPosition, boxWidth, boxHeight + 5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...colors.white);
    doc.text("TOTAL TRIP COST:", margin + 10, yPosition + 18);

    doc.setFontSize(16);
    doc.text(
      `£${totalTripCost.toFixed(2)}`,
      pageWidth - margin - 10,
      yPosition + 18,
      { align: "right" }
    );
    yPosition += boxHeight + 15;

    // Cost distribution section (if there are passengers)
    if (parseInt(passengers) > 0) {
      doc.setFillColor(...colors.green);
      doc.rect(margin, yPosition, pageWidth - margin * 2, 10, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...colors.purple);
      doc.text("COST DISTRIBUTION", margin + 5, yPosition + 7);
      yPosition += 20;

      if (!driverContributes || driverContributionPercentage < 100) {
        // Driver payment
        doc.setFillColor(...colors.beige);
        doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(...colors.purple);
        doc.text("Driver pays:", margin + 10, yPosition + 17);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(
          `£${driverCost.toFixed(2)}`,
          pageWidth - margin - 10,
          yPosition + 17,
          { align: "right" }
        );
        yPosition += boxHeight + 5;

        // Passenger payment
        doc.setFillColor(...colors.lightBeige);
        doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(...colors.purple);
        doc.text("Each passenger pays:", margin + 10, yPosition + 17);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(
          `£${passengerCost.toFixed(2)}`,
          pageWidth - margin - 10,
          yPosition + 17,
          { align: "right" }
        );
      } else {
        // Equal cost per person
        doc.setFillColor(...colors.beige);
        doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(...colors.purple);
        doc.text("Cost per person:", margin + 10, yPosition + 17);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(
          `£${costPerPerson.toFixed(2)}`,
          pageWidth - margin - 10,
          yPosition + 17,
          { align: "right" }
        );
      }
    }

    // Footer
    doc.setFillColor(...colors.purple);
    doc.rect(0, pageHeight - 20, pageWidth, 20, "F");

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...colors.white);
    doc.text("Thanks for getting Trippy", pageWidth / 2, pageHeight - 8, {
      align: "center",
    });

    // Save the PDF with a custom filename
    doc.save(
      `${
        journeyName ? journeyName.replace(/\s+/g, "-").toLowerCase() : "journey"
      }-costs.pdf`
    );
  };

  return (
    <button
      className="pdf-export-button"
      onClick={generatePDF}
      disabled={!journeyName || !distance || !fuelCost || !mpg}
    >
      Download PDF Summary
    </button>
  );
};

export default PdfExport;
